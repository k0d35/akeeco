package com.sunisland.api.service;

import com.sunisland.api.domain.FaqTopic;
import com.sunisland.api.dto.FaqResponse;
import com.sunisland.api.exception.NotFoundException;
import com.sunisland.api.repository.FaqTopicRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class PublicContentService {
  private final FaqTopicRepository faqTopicRepository;

  public FaqResponse getFaqByTopic(FaqTopic topic) {
    var document = faqTopicRepository.findByTopic(topic)
      .orElseThrow(() -> new NotFoundException("No FAQ content found for topic " + topic));
    return new FaqResponse(
      document.getTopic(),
      document.getItems().stream().map(item -> new FaqResponse.FaqRow(item.getQuestion(), item.getAnswer())).toList()
    );
  }
}

